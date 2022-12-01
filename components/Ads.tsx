import { Adsense } from '@ctrl/react-adsense'

export enum AdsArea {
  gridview,
  download,
}

const Ads = (props: { area?: AdsArea } = { area: AdsArea.gridview }) => {

  return <div className="grid col-span-2 md:hidden">
    <Adsense
        client="ca-pub-7552554883632400"
        slot="2485323925"
        style={{ display: 'block' }}
        layout="in-article"
        format="fluid"
      />
  </div>
}

export default Ads;