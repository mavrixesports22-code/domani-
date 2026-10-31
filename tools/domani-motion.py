from pathlib import Path
import subprocess, imageio_ffmpeg
root=Path(__file__).resolve().parent.parent
out=root/'domani'/'motion'
out.mkdir(parents=True,exist_ok=True)
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
scenes=[
 ('hero.mp4','obsidian-cinematic-hero.png',1920,1080),
 ('obsidian.mp4','DOMANI_ColourRoom_Obsidian_Mobile_1440x1800_e1c32f01-17f6-485c-9ae3-f7b6b969823a.jpg',720,900),
 ('tomorrow.mp4','DOMANI_Tomorrow_Desktop_2560x1440_7892f6ed-1beb-498b-a3e4-df4bd5a61b87.jpg',1280,720),
 ('discovery.mp4','DOMANI_Discovery_Set_Square_2048.jpg',900,900),
]
for name,source,width,height in scenes:
 target=out/name
 if target.exists():continue
 vf=f"scale=2560:-1,zoompan=z='1.055+0.025*sin(2*PI*on/240)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=240:s={width}x{height}:fps=30,format=yuv420p"
 subprocess.run([ffmpeg,'-v','error','-y','-i',str(root/'domani'/'assets'/source),'-vf',vf,'-t','8','-c:v','libx264','-preset','fast','-crf','21','-movflags','+faststart',str(target)],check=True)
 print(name, target.stat().st_size, flush=True)
