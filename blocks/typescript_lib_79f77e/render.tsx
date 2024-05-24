import { Slide } from '@netless/slide'
import ReactDOM from 'react-dom/client'
import { useEffect, useRef, useState } from 'react'

export default {
  setup(dom: HTMLDivElement, ctx: any) {
    return ctx.events.on("message", message => {
      console.log("payload", message.payload)
      ReactDOM.createRoot(dom).render(
        <Slider uuid={message.payload.uuid} prefix={message.payload.prefix} />
      );
    });
  }
}

interface SliderProps {
  uuid: string;
  prefix: string;
}

const Slider = ({uuid, prefix}: SliderProps) => {
  const ref = useRef()
  const sliderRef = useRef<Slide>()
  const [currentIndex, setCurrentIndex] = useState(1)
  const [pageCountEl, setPageCountEl] = useState(null)
  useEffect(() => {
    const slide = new Slide({
      anchor: ref.current,
      mode: 'local',
      interactive: true,
      logger: console,
    })
    sliderRef.current = slide;
    slide.setResource(uuid, prefix);
    slide.renderSlide(currentIndex);
    slide.on("renderEnd", async (index: number) => {
      setCurrentIndex(index);
      const textContent = `${index} / ${await slide.getSlideCountAsync()}`;
      setPageCountEl(textContent);
    })
    return () => {
      slide.destroy();
    }
  }, [uuid, prefix]);
  return (
   <div style={{width: "100%", height: "100%"}}>
    <div style={{height: 400}} ref={ref}></div>
    <div style={{width: "50%", transform: "translate(50%, 0)", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <button
        onClick={() => {
          sliderRef.current?.renderSlide(currentIndex - 1)
        }}
        >上一页</button>
      <button
        onClick={() => {
          sliderRef.current?.prevStep()
        }}
      >上一步</button>
      <span>{pageCountEl}</span>
      <button
        onClick={() => {
          sliderRef.current?.nextStep()
        }}
      >下一步</button>
      <button
        onClick={() => {
          sliderRef.current?.renderSlide(currentIndex + 1)
        }}
      >下一页</button>
    </div>
   </div>
  )
}