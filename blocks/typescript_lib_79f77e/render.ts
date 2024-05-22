import { Slide } from '@netless/slide'

export default {
  setup(dom: HTMLDivElement, ctx: any) {
    console.log('setup')
    // dom.style.width = "600px";
    // dom.style.height = "700px";
    const disposer = ctx.events.on("message", message => {
      console.log("payload", message.payload)

      if (Object.keys(message.payload).length === 0) {
        return () => {
          disposer()
        }
      }
  
      const anchor = document.createElement('div')
      anchor.style.height = "400px"
      dom.appendChild(anchor)
      const slide = new Slide({
        anchor: anchor,
        mode: 'local',
        interactive: true,
        logger: console,
      })
      
      slide.setResource(message.payload.uuid, message.payload.prefix);
      const pageCountEl = document.createElement('span')
      let currentIndex = 1;
      slide.renderSlide(currentIndex);
      slide.on("renderEnd", async (index: number) => {
        currentIndex = index;
        pageCountEl.textContent = `${index} / ${await slide.getSlideCountAsync()}`
      })
      console.log(slide);
      (window as any).slide = slide;

  
      const controllerContainer = document.createElement('div')
      const prevStepButton = document.createElement('button')
      prevStepButton.textContent = '<'
      prevStepButton.addEventListener('click', () => slide.prevStep())
      const nextStepButton = document.createElement('button')
      nextStepButton.textContent = '>'
      nextStepButton.addEventListener('click', () => slide.nextStep())
      const prevPageButton = document.createElement("button")
      prevPageButton.textContent = "<<"
      prevPageButton.addEventListener('click', () => slide.renderSlide(currentIndex - 1))
      const nextPageButton = document.createElement("button")
      nextPageButton.textContent = ">>"
      nextPageButton.addEventListener('click', () => slide.renderSlide(currentIndex + 1))
      controllerContainer.append(prevPageButton, prevStepButton, pageCountEl, nextStepButton, nextPageButton)
      

      controllerContainer.style.display = "flex";
      controllerContainer.style.width = "50%";
      controllerContainer.style.transform = 'translate(50%, 0)'
      controllerContainer.style.justifyContent = "space-between";
      controllerContainer.style.alignItems = "center";
      dom.appendChild(controllerContainer)
  
  
      return () => {
        // 清理
        disposer()
        slide.destroy();
        dom.removeChild(anchor);
        dom.removeChild(controllerContainer);
        prevStepButton.removeEventListener('click', () => slide.prevStep())
        nextStepButton.removeEventListener('click', () => slide.nextStep())
      }
    });
  }
}