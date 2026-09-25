# Original neon stage clip, 30fps. Output: frames/f001.webp ...
import numpy as np
from PIL import Image, ImageFilter
W,H,FPS,N=1280,720,30,210
rng=np.random.default_rng(7)
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
noise=np.array(Image.fromarray((rng.random((18,32))*255).astype('uint8')).resize((W*2,H),Image.BICUBIC).filter(ImageFilter.GaussianBlur(8))).astype(np.float32)/255
RED,CY,WH=np.array([1,.1,.16]),np.array([.1,.95,.9]),np.array([1,1,1])
beams=[(.12,RED),(.32,CY),(.5,WH),(.68,RED),(.88,CY)]
bok=[(rng.random()*W,rng.random()*H,rng.random()*14+4,rng.random(),rng.choice([0,1])) for _ in range(46)]
crowd=[(x,rng.random()*6.28,rng.random()*30+40) for x in np.linspace(-20,W+20,26)]
mark=Image.open('img/mark-light.png').convert('RGBA'); mark=mark.resize((int(mark.width*300/mark.height),300))
for i in range(N):
    t=i/(N-1); s=i/FPS
    img=np.zeros((H,W,3),np.float32)
    hz=noise[:,int(s*50)%W:int(s*50)%W+W]*.8+.35
    for k,(bx,col) in enumerate(beams):
        ox=bx*W; ang=np.sin(s*1.1+k*1.7)*.42+(bx-.5)*-.5+np.sin(t*6.28)*.1
        dx,dy=xx-ox,yy+40
        a=np.arctan2(dx,dy); d=np.sqrt(dx*dx+dy*dy)
        c=np.exp(-((a-ang)/(.07+.05*t))**2)*np.clip(1.15-d/1100,0,1)*(.55+.45*np.sin(s*3+k))*(.6+.6*t)
        img+=(c*hz)[...,None]*col*.9
    fl=np.exp(-(((xx-W/2)/(520+140*t))**2+((yy-H*.86)/50)**2))
    img+=fl[...,None]*(RED*.5+CY*.2)*(.5+.5*t)
    im=Image.fromarray((np.clip(img,0,1)*255).astype('uint8'))
    for (x,y,r,ph,c) in bok:
        pass
    over=Image.new('RGBA',(W,H),(0,0,0,0)); px=over.load()
    b=np.zeros((H,W,4),np.float32)
    for (x,y,r,ph,c) in bok:
        cy=(y-s*30*(.5+ph))%H; cx=x+np.sin(s+ph*6)*20
        x0,x1,y0,y1=int(max(cx-r*2,0)),int(min(cx+r*2,W)),int(max(cy-r*2,0)),int(min(cy+r*2,H))
        if x1>x0 and y1>y0:
            g=np.exp(-(((xx[y0:y1,x0:x1]-cx)**2+(yy[y0:y1,x0:x1]-cy)**2)/(r*r)))
            img_add=g[...,None]*(CY if c else RED)*.35
            b[y0:y1,x0:x1,:3]+=img_add
    base=np.array(im).astype(np.float32)/255+b[...,:3]
    # crowd silhouettes
    sil=Image.new('L',(W,H),0); from PIL import ImageDraw; d=ImageDraw.Draw(sil)
    for (x,ph,hh) in crowd:
        bob=np.sin(s*4+ph)*8; top=H-hh-70+bob
        d.ellipse([x-26,top-30,x+26,top+22],fill=255); d.rectangle([x-40,top+20,x+40,H],fill=255)
        for sd in(-1,1):
            up=np.sin(s*5+ph+sd)*14
            d.line([x+sd*30,top+40,x+sd*(52+up*.3),top-46-up],fill=255,width=13)
    d.rectangle([0,H-40,W,H],fill=255)
    sm=np.array(sil.filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)/255
    rim=np.array(sil.filter(ImageFilter.GaussianBlur(5))).astype(np.float32)/255
    base=base*(1-sm[...,None])+((rim-sm).clip(0,1))[...,None]*RED*.35
    v=1-np.clip(((xx-W/2)/(W*.75))**2+((yy-H/2)/(H*.8))**2,0,1)*.7
    out=Image.fromarray((np.clip(base*v[...,None],0,1)*255).astype('uint8')).convert('RGBA')
    if t>.5:
        a=min(1,(t-.5)/.25); m=mark.copy(); m.putalpha(m.getchannel('A').point(lambda p:int(p*a)))
        gl=m.filter(ImageFilter.GaussianBlur(18)); gx,gy=(W-m.width)//2,(H-m.height)//2-70
        out.alpha_composite(gl,(gx,gy)); out.alpha_composite(m,(gx,gy))
    out.convert('RGB').save(f'frames/f{i+1:03d}.webp',quality=62)
print(N)
