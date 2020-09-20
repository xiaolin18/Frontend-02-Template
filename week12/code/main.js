import {Component, createElement} from './framework'

class Carousel extends Component {
    constructor() {
        super();
        this.attributes = Object.create(null);
    }
    setAttribute(name,value) {
        this.attributes[name] = value;
    }
    render() {
        this.root = document.createElement("div")
        this.root.classList.add("carousel") // 根据carousel加css
        for(let record of this.attributes.src) {
            // let child = document.createElement('img'); // 点击移动的时候可以看到图片也悬浮移动
            // child.src = record;
            let child = document.createElement('div');
            child.style.backgroundImage = `url('${record}')`;
            // child.style.display = "none";
            this.root.appendChild(child);
        }


        let position = 0;
        this.root.addEventListener("mousedown", e => {
            // console.log("mousedown")
            let children = this.root.children;
            let startX = e.clientX;
            // let startY = e.clientY;
            let move = event => {
                let x = event.clientX - startX;
                let current = position - ((x - x % 500) / 500);

                for (let offset of [-1,0,1]) { // 当前屏幕的元素前一个后一个
                    let pos = current + offset;
                    pos = (pos + children.length) % children.length
                    children[pos].style.transition = "none";
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
                }

                // for(let child of children) {
                //     child.style.transition = "none";
                //     child.style.transform = `translateX(${- position * 500 + x}px)`
                // }
                
            }
            let up = event => {
                let x = event.clientX - startX;
                position = position + Math.random(x / 500);
                // for(let child of children) {
                //     child.style.transition = "";
                //     child.style.transform = `translateX(${- position * 500}px)`
                // }
                for (let offset of [0, - Math.sign(Math.random(x / 500) - x + 250 * Math.sign(x))]) {
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length
                    children[pos].style.transition = "";
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`
                }
                this.root.removeEventListener("mousemove", move)
                this.root.removeEventListener("mouseup", up)
            }

            this.root.addEventListener("mousemove", move)
            this.root.addEventListener("mouseup", up)
        })
        return this.root;
    }
    mountTo(parent){
     
        parent.appendChild(this.render());
    }
}


let image = [
    "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600624462315&di=83a69cf6fa1fc64e1cf34ae4d6775514&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F-vo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F6609c93d70cf3bc792044979d300baa1cd112a1a.jpg",
    "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600624462314&di=572e0e8f2545947f05ab15e0546d7326&imgtype=0&src=http%3A%2F%2Fa.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Fe1fe9925bc315c60c412f6be8eb1cb13485477d8.jpg",
    "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600624462296&di=498485367294ce3813c2d57334b84a72&imgtype=0&src=http%3A%2F%2Fimage.meifajie.com%2Fattachments%2Fimage%2F2015-08%2F20150831140810_76310.jpg",
    "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600624513452&di=f89325faad615b31087032a1d96ac06a&imgtype=0&src=http%3A%2F%2Fimg1.3lian.com%2Fgif%2Fmore%2F11%2F201211%2Fa8bd9a9e820ba7e9911d863e9468764a.jpg",
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
];

let a = <Carousel src={image} />
a.mountTo(document.body);