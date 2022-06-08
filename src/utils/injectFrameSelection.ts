// 可以注入框选功能，并获取选框的位置和大小
type OnNewBoxGenerate = (newBoxParams: INewBoxParams) => void

export default function injectFrameSelection(
  selector: string,
  newBoxCallback?: OnNewBoxGenerate,
): void {
  const layoutEl = document.querySelector<HTMLElement>(selector)

  let frameEl: HTMLDivElement
  let startX = 0
  let startY = 0
  let pid = ''

  // 创建并挂载虚线框元素
  if (layoutEl) {
    frameEl = createFrame()
    layoutEl.append(frameEl)

    layoutEl.addEventListener('mousedown', mousedownHandler)
    document.addEventListener('mouseup', mouseupHandler)
  }

  // 创建虚线框
  function createFrame(): HTMLDivElement {
    const frameEl = document.createElement('div')
    frameEl.style.position = 'fixed'
    frameEl.style.border = '1px solid #074f8a'
    frameEl.style.display = 'none'
    frameEl.style.backgroundColor = 'rgba(7, 79, 138, 0.1)'
    frameEl.style.boxShadow = '0 0 5px rgba(7, 79, 138, 0.3)'
    return frameEl
  }

  // 鼠标左键按下时：
  // 显示虚线框，添加 mousemove 监听函数
  function mousedownHandler(e: MouseEvent) {
    pid = (e.target as HTMLDivElement).id || ''
    setStart(e.clientX, e.clientY)
    setEnd()

    // 判断为左键时进行框选
    if (e.button === 0) {
      layoutEl?.addEventListener('mousemove', mousemoveHandler)
    }
  }

  // 鼠标左键松开时：
  // 隐藏虚线框，移除相关事件监听
  // 重置起始点坐标
  function mouseupHandler() {
    newBoxCallback?.({
      ...(JSON.parse(JSON.stringify(frameEl.getBoundingClientRect())) as DOMRect),
      pid,
    })
    setStart()
    setEnd()

    frameEl.style.display = 'none'
    layoutEl?.removeEventListener('mousemove', mousemoveHandler)
    document.removeEventListener('mousemove', mouseupHandler)
  }

  // 鼠标移动时获取其位置
  function mousemoveHandler(e: MouseEvent) {
    frameEl.style.display = 'block'
    setEnd(e.clientX, e.clientY)
  }

  // 鼠标按下时：设置起始点
  function setStart(x: number = 0, y: number = 0) {
    startX = x
    startY = y
  }

  // 鼠标移动时：设置终点，并计算虚线框宽高
  function setEnd(endX: number = 0, endY: number = 0) {
    requestAnimationFrame(() => {
      if (layoutEl) {
        // move left
        if (startX >= endX) {
          frameEl.style.left = ''
          frameEl.style.bottom = ''
          frameEl.style.right = `${layoutEl.clientWidth - startX - 1}px`
          frameEl.style.top = `${startY}px`
        }
        // move right
        else {
          frameEl.style.right = ''
          frameEl.style.bottom = ''
          frameEl.style.left = `${startX}px`
          frameEl.style.top = `${startY}px`
        }

        // move up
        if (startY > endY) {
          frameEl.style.top = ''
          frameEl.style.bottom = `${layoutEl.clientHeight - startY - 1}px`
        }
        frameEl.style.width = `${Math.abs(endX - startX)}px`
        frameEl.style.height = `${Math.abs(endY - startY)}px`
      }

      // // 以下使用 transform 实现，但在性能不好的浏览器上左上或左下移动时，线条会发生轻微抖动
      // frameEl.style.width = `${Math.abs(endX - startX)}px`
      // frameEl.style.height = `${Math.abs(endY - startY)}px`
      // frameEl.style.left = `${startX}px`
      // frameEl.style.top = `${startY}px`
      // frameEl.style.transform = `translate(${endX > startX ? 0 : 'calc(-100% + 1px)'}, ${
      //   endY > startY ? 0 : 'calc(-100% + 1px)'
      // }`
    })
  }
}
