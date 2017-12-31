window.reqAnimation = window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.requestAnimationFrame

function Canvas(width, height) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    return [canvas, ctx]
}

function computeFrame(video, ctx, ctx2 = null) {
    const width = video.videoWidth
    const height = video.videoHeight
    ctx.drawImage(video, 0, 0, width, height)
    if (!ctx2) return
    // 如果有指定ctx2, 代表要畫另一個
    // 在這邊以灰階做範例
    const imageData = ctx.getImageData(0, 0, width, height)
    const ctxBuffer = imageData.data
    let buf, r, g, b, avg
    for (let i = 0; i < ctxBuffer.length; i += 4) {
        buf = ctxBuffer
        r = buf[i]
        g = buf[i + 1]
        b = buf[i + 2]
        avg = (r + g + b) / 3
        buf[i] = buf[i + 1] = buf[i + 2] = avg
    }
    ctx2.putImageData(imageData, 0, 0)
}

function play() {
    // 如果 video暫停, 或是已經播放完畢則停止繪圖
    computeFrame(video, ctx1, ctx2)
    if (video.paused || video.ended) return
    reqAnimation(play)
}

const video = document.getElementById('demoVideo')
video.addEventListener('play', e => play())

document.querySelector('button')
    .addEventListener('click', event => {
        canvas1.width = canvas2.width = video.videoWidth
        canvas1.height = canvas2.height = video.videoHeight
        video.paused == false ? video.pause() : video.play()
    })

const [canvas1, ctx1] = Canvas(video.width, video.height)
document.body.appendChild(canvas1)
const [canvas2, ctx2] = Canvas(video.width, video.height)
document.body.appendChild(canvas2)



