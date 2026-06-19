from __future__ import annotations

import os
import pathlib
import shutil
import subprocess
import sys


ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "videos" / "intro.mp4"
DEFAULT_SOURCE = pathlib.Path(r"C:\Users\HP\Downloads\VID-20260530-WA0046.mp4")
SOURCE = pathlib.Path(os.environ.get("INTRO_SOURCE_VIDEO", DEFAULT_SOURCE))
INTRO_DURATION_SECONDS = float(os.environ.get("INTRO_DURATION_SECONDS", "25"))


def find_ffmpeg() -> str:
    candidates = [
        os.environ.get("FFMPEG_PATH"),
        r"C:\tmp\portfolio-video-tools\node_modules\ffmpeg-static\ffmpeg.exe",
        shutil.which("ffmpeg"),
    ]
    for candidate in candidates:
        if candidate and pathlib.Path(candidate).exists():
            return str(candidate)
    raise FileNotFoundError("Set FFMPEG_PATH or install ffmpeg-static in C:\\tmp\\portfolio-video-tools.")


def ffmpeg_font(path: str) -> str:
    return path.replace("\\", "/").replace(":", r"\:")


def render() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(f"Missing source video: {SOURCE}")

    ffmpeg = find_ffmpeg()
    OUT.parent.mkdir(parents=True, exist_ok=True)

    bold = ffmpeg_font(r"C:\Windows\Fonts\arialbd.ttf")
    regular = ffmpeg_font(r"C:\Windows\Fonts\arial.ttf")
    mono = ffmpeg_font(r"C:\Windows\Fonts\consola.ttf")

    duration = INTRO_DURATION_SECONDS
    # This preserves the real moving footage and original voice while presenting it
    # as a premium portfolio intro instead of a raw phone recording.
    filter_complex = (
        f"color=c=0x05070d:s=1280x720:r=30:d={duration}[base];"
        f"[0:v]trim=start=0:duration={duration},setpts=PTS-STARTPTS,"
        "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,"
        "gblur=sigma=24,eq=brightness=-0.43:saturation=0.48:contrast=1.06[blur];"
        "[base][blur]blend=all_mode=screen:all_opacity=0.28,format=rgba,"
        "drawgrid=width=80:height=80:color=0x22d3ee@0.075:thickness=1,"
        "drawbox=x=44:y=42:w=1192:h=636:color=0x22d3ee@0.30:t=1,"
        "drawbox=x=86:y=30:w=420:h=660:color=0x22d3ee@0.55:t=2,"
        "drawbox=x=552:y=96:w=640:h=494:color=0x0f172a@0.58:t=fill,"
        "drawbox=x=552:y=96:w=640:h=494:color=0x22d3ee@0.30:t=2[bg];"
        f"[0:v]trim=start=0:duration={duration},setpts=PTS-STARTPTS,"
        "scale=-2:640,eq=brightness=0.015:contrast=1.04:saturation=1.04,format=rgba[person];"
        "[bg][person]overlay=x=116:y=40:format=auto,"
        "drawbox=x=116:y=40:w=360:h=640:color=0x8b5cf6@0.20:t=2,"
        "drawbox=x=104:y=28:w=384:h=664:color=0x22d3ee@0.18:t=1,"
        f"drawtext=fontfile={bold}:text='Ebbad Ur Rehman':x=600:y=132:fontsize=56:fontcolor=0xf8fafc:shadowcolor=0x000000@0.48:shadowx=2:shadowy=3,"
        f"drawtext=fontfile={bold}:text='Software Engineer / Full-Stack Developer':x=604:y=202:fontsize=30:fontcolor=0x7df9ff:shadowcolor=0x000000@0.35:shadowx=1:shadowy=2,"
        "drawbox=x=604:y=268:w=64:h=38:color=0x22d3ee@0.86:t=fill,"
        "drawbox=x=684:y=268:w=130:h=38:color=0x3b82f6@0.82:t=fill,"
        "drawbox=x=830:y=268:w=170:h=38:color=0x8b5cf6@0.82:t=fill,"
        "drawbox=x=1016:y=268:w=156:h=38:color=0x22d3ee@0.78:t=fill,"
        "drawbox=x=604:y=318:w=146:h=38:color=0x3b82f6@0.78:t=fill,"
        f"drawtext=fontfile={regular}:text='AI':x=626:y=277:fontsize=18:fontcolor=0xffffff,"
        f"drawtext=fontfile={regular}:text='Databases':x=704:y=277:fontsize=18:fontcolor=0xffffff,"
        f"drawtext=fontfile={regular}:text='Backend APIs':x=850:y=277:fontsize=18:fontcolor=0xffffff,"
        f"drawtext=fontfile={regular}:text='Computer Vision':x=1032:y=277:fontsize=18:fontcolor=0xffffff,"
        f"drawtext=fontfile={regular}:text='Product UX':x=622:y=327:fontsize=18:fontcolor=0xffffff,"
        f"drawtext=fontfile={mono}:text='REAL VOICE PORTFOLIO INTRO':x=604:y=420:fontsize=18:fontcolor=0x22d3ee,"
        f"drawtext=fontfile={regular}:text='Full-stack systems, AI tools, databases, backend APIs,':x=604:y=462:fontsize=23:fontcolor=0xe2e8f0,"
        f"drawtext=fontfile={regular}:text='computer vision, and interactive product experiences.':x=604:y=498:fontsize=23:fontcolor=0xe2e8f0,"
        "drawbox=x=604:y=628:w=520:h=6:color=0x94a3b8@0.35:t=fill,"
        f"drawbox=x=604:y=628:w='520*t/{duration}':h=6:color=0x22d3ee@0.90:t=fill,"
        "format=yuv420p[v];"
        f"[0:a]atrim=start=0:duration={duration},asetpts=PTS-STARTPTS,"
        "highpass=f=80,lowpass=f=12000,loudnorm=I=-16:TP=-1.5:LRA=11[a]"
    )

    cmd = [
        ffmpeg,
        "-y",
        "-i",
        str(SOURCE),
        "-filter_complex",
        filter_complex,
        "-map",
        "[v]",
        "-map",
        "[a]",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "18",
        "-c:a",
        "aac",
        "-b:a",
        "160k",
        "-movflags",
        "+faststart",
        str(OUT),
    ]
    subprocess.run(cmd, check=True)
    print(f"Rendered public/videos/intro.mp4 from {SOURCE.name} ({duration:.0f}s).")


if __name__ == "__main__":
    try:
        render()
    except Exception as exc:
        print(f"Intro render failed: {exc}", file=sys.stderr)
        raise
