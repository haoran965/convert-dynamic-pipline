import { Slide } from '@netless/slide'

export default {
  async setup(dom, ctx) {
    console.log(ctx)
    dom.style.width = "600px";
    dom.style.height = "700px";
    const disposer = ctx.events.on("renderSlide", message => {
      console.log(message.payload)
    });
    const canvas = document.createElement('canvas')
    dom.appendChild(canvas)
    const slide = new Slide({
      anchor: canvas,
      mode: 'local',
      interactive: true,
    })
    slide.setResource(message.payload.in.uuid, message.payload.in.prefix)

    const controllerContainer = document.createElement('div')
    const prevStepButton = document.createElement('button')
    prevStepButton.textContent = '<'
    prevStepButton.addEventListener('click', slide.prevStep)
    const nextStepButton = document.createElement('button')
    nextStepButton.textContent = '>'
    nextStepButton.addEventListener('click', slide.nextStep)

    controllerContainer.append(prevStepButton, nextStepButton)
    dom.appendChild(controllerContainer)
    
    return () => {
      // 清理
      disposer()
      slide.destroy();
      prevStepButton.removeEventListener('click', slide.prevStep)
      nextStepButton.removeEventListener('click', slide.nextStep)
    }
  }
}