import React from 'react'
import Text from '@/components/atoms/text/Text'
import Image from 'next/image'
import style from './styles.module.scss'

export default function AppMobileSection (): JSX.Element {
  return (
    <article id="AppMobile" className={style.AppMobile}>
      <figure className={style.phoneContainer}>
        <div className={style.phone}>
          <Image
            src="/assets/img/mockups/phone.webp"
            width={472}
            height={720}
            alt="phone"
          />

          <picture>
            <source
              srcSet="/assets/img/misc/backgroundPhone-dark.webp"
              media="(prefers-color-scheme: dark)"
            />
            <Image
              src="/assets/img/misc/backgroundPhone.webp"
              width={300}
              height={650}
              alt="phone-content"
            />
          </picture>
        </div>
        <Image
          src="/assets/img/patterns/blob-phone-wavesection.webp"
          className={style.blob}
          width={500}
          height={900}
          alt="blob"
        />
      </figure>
      <article className={style.text}>
        <Text tag="h1" size={'2.3rem'} weight="700">
          ¡Tenemos una app para Móvil!
        </Text>
        <Text size={'1.25rem'}>
          Descarga GoldenDuck en tu celular y maneja tu dinero con un 200% de
          eficiencia, lleva tu cartera online a donde sea que vayas para pagar
          servicios o incluso tomar un café.
        </Text>
        <Image
          src="/assets/img/misc/qr-mobile-app.webp"
          width={225}
          height={225}
          alt="AppQR"
        />
      </article>
    </article>
  )
}
