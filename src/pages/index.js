import React from 'react'
import { Link } from 'gatsby'
import Seo from '../components/Seo'

const Index = () => {
  return (
    <div>
      <Seo title='Nosso Blog - PowerSites' description='Valor da descrição'/>
     
      <h1>PowerSites</h1>
      <p>
        <Link to='/blog'>Blog</Link>
      </p>
    </div>
  )
}
export default Index