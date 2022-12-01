export default function LottiePlayer({ src, style }: { src: any, style?: any }){
  return <lottie-player
            autoplay                    
            loop=""
            mode="normal"
            src={src}
            background="transparent"
            style={style || { height: "auto" }}
          ></lottie-player>
}