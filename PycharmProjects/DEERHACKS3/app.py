import moviepy.editor as mp
import speech_recognition as sr
import openai
from flask import Flask, request, jsonify

openai.api_key = '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'
app = Flask(__name__)


def extract_audio(video_path, output_audio_path):
    video = mp.VideoFileClip(video_path)
    audio = video.audio
    audio.write_audiofile(output_audio_path)


def speech_to_text(audio_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio, language ="en-IN", show_all =True)
        return text
    except sr.UnknownValueError:
        print("Sorry, could not understand audio.")
        return None
    except sr.RequestError as e:
        print("Could not request results; {0}".format(e))
        return None


@app.route('/extract_audio', methods=['POST'])
def handle_extract_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    video_file = request.files['file']
    if video_file.filename == '':
        return jsonify({"error": "No selected file"})

    video_path = 'temp_video.mp4'
    audio_output_path = 'extracted_audio.wav'

    # Save the uploaded video temporarily
    video_file.save(video_path)

    # Extract audio from the video
    extract_audio(video_path, audio_output_path)

    text_to_analyze = speech_to_text(audio_output_path)
    return informal(text_to_analyze)


def informal(text_to_analyze):
    """
    If the text is informal, function returns a sentence of why it is informal.
    If it is formal, it returns an empty string.
    :param text_to_analyze: text to be analyzed
    :return: str
    """
    # Use OpenAI's Completion API to analyze the text
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt = "Is the provided interview response inappropriate? If yes, " +
                  "respond 'Yes' and explain why it's inappropriate in one " +
                  "sentence; if not, simply say 'No'. " + text_to_analyze,
        max_tokens=100,
        temperature=0.5,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    # Extract the generated text from the response
    generated_text = response.choices[0].text.strip()
    return generated_text


if __name__ == '__main__':
    app.run(debug=True)

