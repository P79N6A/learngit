import React from 'react'
import { connect } from 'dva'
import styles from './index-page.less'

function IndexPage() {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>欢迎来到自助机运维平台</h1>
      <div className={styles.welcome} />
    </div>
  )
}

IndexPage.propTypes = {}

export default connect()(IndexPage)
