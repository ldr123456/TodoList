import React, { Component, RefObject } from 'react'

interface AnimationProps{
  from?: number;
  to?: number;
  duration?: number;
  render: (opacity:number) => React.ReactElement;
}
interface AnimationState {
  opactiy: number
}

class Animation extends Component<AnimationProps, AnimationState>{
  animationFrame: number | null = null;

  state: AnimationState = {
    opactiy: this.props.from ?? 0
  }
  componentDidUpdate(prevProps: AnimationProps) {
    if(this.props.from !== prevProps.from ||this.props.to !== prevProps.to ||this.props.duration !== prevProps.duration){
      this.startAnimation()
    }
  }
  componentDidMount(): void {
    if(this.animationFrame !== null){
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
  }
  // 腾讯文档子公司 文档商业化相关 
  startAnimation = () => {
    const {from = 0, to = 1, duration = 1000} = this.props
    const startTime = performance.now()
    const animate = (timestamp: number) => {
      if(this.animationFrame === null) return
      const progress = Math.min((timestamp - startTime)/duration, 1)
      const currentValue = from + progress * (to - from)
      this.setState({opactiy: currentValue})
      if(progress < 1){
        this.animationFrame = requestAnimationFrame(animate)
      }else{
        this.animationFrame = null
      }
    }
    this.animationFrame = requestAnimationFrame(animate)
  }
  render(){
    return this.props.render(this.state.opactiy)
  }
}

export default Animation