from flask_cors import CORS
import moviepy.editor as mp
import speech_recognition as sr
import openai

from flask import Flask, request, jsonify
openai.api_key = "Insert your API key here"
app = Flask(__name__)

CORS(app)

def extract_audio(video_path, output_audio_path):
    video = mp.VideoFileClip(video_path)
    audio = video.audio
    audio.write_audiofile(output_audio_path)


def speech_to_text(audio_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio, language="en-IN", show_all=False)
        return text
    except sr.UnknownValueError:
        print("Sorry, could not understand audio.")
        return None
    except sr.RequestError as e:
        print("Could not request results; {0}".format(e))
        return None


@app.route('/extract_audio', methods=['POST'])
def handle_extract_audio():
    global prompt_q
    prompt_q = ""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    video_file = request.files['file']
    if video_file.filename == '':
        return jsonify({"error": "No selected file"})
    elif video_file.filename == "file1.mov":  #TODO hard code file names
        prompt_q = "This is the question they are answering: What is your strongest coding language? If they completly have a answer not related to the question or go off topic, give them feed back accordingly."  #TODO fill question prompt in. add a whitespace at the end
    elif video_file.filename == "file2.mov":  #TODO hard code file names
        prompt_q = "This is the question they are answering: How have you worked in a group setting in the past? If they completly have a answer not related to the question or go off topic, give them feed back accordingly."  #TODO fill question prompt in. add a whitespace at the end
    
    video_path = 'temp_video.mp4'
    audio_output_path = 'extracted_audio.wav'

    # Save the uploaded video temporarily
    video_file.save(video_path)
    # Extract audio from the video
    extract_audio(video_path, audio_output_path)

    transcript = speech_to_text(audio_output_path)
    out = feedback(transcript) + '\nYour overall scores are: ' + rate(transcript)
    return out


def feedback(text_to_analyze):
    """
    give feedback on input transcript
    """
    # Use OpenAI's Completion API to analyze the text
    # Use OpenAI's Completion API to analyze the text
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt="You are helping someone practice their interviewing skills. " + prompt_q + "Offer some " +
        "feedback on the following transcript outlining any areas for improvement. Also reinforce " +
        "any positive aspects of the transcript. Answer with the following categories: positve, " +
        "negative. Answer as if you were responding to the candidate in the first person." + 
        "\n" + text_to_analyze,
        max_tokens=500,
        temperature=0.5,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    # Extract the generated text from the response
    genText = response.choices[0].text.strip()
    print(genText)
    return genText


def rate(text_to_analyze) -> str:
    """
    rate the text out of 10
    """
    # Use OpenAI's Completion API to analyze the text
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt="Pretend you are helping someone practice for an interview. " + prompt_q + "Rate the " +
        "following transcript out of 10 in each category: confidence, passion, professionalism." +
        " Judge using aspects an interviewer would consider such as language proficiency, " +
        "communication skills, or confidence. Return your ratings in this format: category: rating" 
        + "Comma separate each category and don't use newline breaks.\n" + text_to_analyze,
        max_tokens=100,
        temperature=0.5,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    # Extract the generated text from the response
    genText = response.choices[0].text.strip()
    print(genText)
    return genText


if __name__ == '__main__':
    app.run(debug=True)

