import moviepy.editor as mp
import speech_recognition as sr


def extract_audio(video_path, output_audio_path):
    video = mp.VideoFileClip(video_path)
    audio = video.audio
    audio.write_audiofile(output_audio_path, codec='pcm_s32le')  # Specify the codec to ensure WAV format


def speech_to_text(audio_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio, language ="en-IN", show_all =True)
        return text
    except sr.UnknownValueError:
        print(sr.UnknownValueError)
        return None
    except sr.RequestError as e:
        print("Could not request results; {0}".format(e))
        return None


extract_audio("onlinejobinterview.mov", "output.wav")  # Change output format to .wav
print(speech_to_text("output.wav"))  # Provide correct audio file path
