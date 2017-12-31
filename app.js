// 我們將使用requestAnimationFrame方法來連續繪製video影像到canvas上
// 這裡先建立全域方法reqAnimation, 並指向當前裝置的requestAnimationFrame方法 
window.reqAnimation = window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.requestAnimationFrame

// Canvas 工廠函式
function Canvas(width, height) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    return [canvas, ctx]
}

// 取得video元素
const video = document.getElementById('demoVideo')
video.addEventListener('play', e => play())

// 取得控制video的button
document.querySelector('button')
    .addEventListener('click', event => {
        canvas1.width = canvas2.width = video.videoWidth
        canvas1.height = canvas2.height = video.videoHeight
        video.paused == false ? video.pause() : video.play()
    })

// 建立 canvas1, canvas2 並插入body
const [canvas1, ctx1] = Canvas(video.width, video.height)
document.body.appendChild(canvas1)

const [canvas2, ctx2] = Canvas(video.width, video.height)
document.body.appendChild(canvas2)

// 當video元素觸發play事件時開始執行
function play() {
    // 繪圖
    computeFrame(video, ctx1, ctx2)
    // 如果 video暫停, 或是已經播放完畢則停止繪圖
    if (video.paused || video.ended) return
    reqAnimation(play)
}

// 圖像繪製
function computeFrame(video, ctx, ctx2 = null) {
    const width = video.videoWidth
    const height = video.videoHeight

    // 這裡使用 vicdeo為來源，將影像化在ctx上
    ctx.drawImage(video, 0, 0, width, height)

    // 如果沒定義ctx2 在繪製完ctx後直接回傳。
    if (!ctx2) return

    // 如果有指定ctx2, 代表要畫另一個
    // 在這邊以灰階做範例

    // 取得ctx 當前像素
    const imageData = ctx.getImageData(0, 0, width, height)
    const ctxBuffer = imageData.data

    // 取灰階值buff
    let buf, r, g, b, avg
    for (let i = 0; i < ctxBuffer.length; i += 4) {
        buf = ctxBuffer
        r = buf[i]
        g = buf[i + 1]
        b = buf[i + 2]
        avg = (r + g + b) / 3
        buf[i] = buf[i + 1] = buf[i + 2] = avg
    }

    // 更新到ctx2上
    ctx2.putImageData(imageData, 0, 0)
}
