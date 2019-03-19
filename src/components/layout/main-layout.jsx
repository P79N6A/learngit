import React, { Component } from 'react'
import { Layout, Menu } from 'antd'
import { withRouter } from 'dva/router'
import SideMenu from './side-menu'
import menuData from '../../menu'

const { Header, Content, Footer } = Layout
const titleLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAgCAYAAABQISshAAAIxklEQVR42q1YCZBU1RVtiYlLjFoaMSZIUKHUcQOH6Z7eJqix3JdSEcsqF0bRoCaiFiFxqaEqkorBgoJoIc5M///+jEvhEpfEqCiW+0K5i6BgiQkwQc0gSlBmuv/1nNfv/Xm/p5tpwa661X95/7137nLuvS/RVJD9E4vkB4k2GZYQ2QH/OybwSy+SXQ7ulJ8kJuLdEL98ICfkVfgZ/sO8ki0ZX6YmtuPXuFB+mPPlZsz1f0gfZEOzJ6O2+hE+mJzukGRWyb1pJb/A/W1Zrzg9jc3l/PCRnJKZDYtkt1Sn5PJByaspfrixJRCh5AJ5t9a4rCrNSirZO9Uu++J6PsB3VxOs+xwA9Ns5cf0UlHVPdZGuxFhP9sz6cjo+/CjXKUe1qPA/uFbYzHVGw49mYZlmaBn3fbXELqgXDaRYc6wKX8V8P08VZAyUttpofLAEAyAMkL6tyNqyWeBODR2yF82Hh3NgnYsA5GYD5N7R82UngD0sp4qt1QTvLnFAhFoRNcf2n063hfvsgXUmcS0rGSUzMNdV+t4P74ksrKSk99QlF1Lgur/D/TR7nw3krATdKd0tRww4G+IEkrpDxqQ6i2dnPTl+SKduk11dIAA/5bvExJELZDjWWdCi5IucJxO1y3sy07HGF3pcID8mUN7T5WOT0F9hiQmIgWMw6LZ0l5yZL8gfxxVkH2htPx3wIINUt+xeS472+podIH1pXy6rNVbPR2KJk8XfBzYd3qef+XKLA+QTTUBKbsJ1yTz7kJ4ySCv7zgZa+C6QLkScLE8W5Fhcr6abEGg+CFfVFMSVA6SEZz21x8prcI2DYoTjSSu+26Kt6csyMqXeR+RapeUcB6vlsdanZauHn2bu7GsaBGQcQCSekR3pbxlPrgX6U42/P4iFT8EG/qclkN5YPAThppwKN8WAqHAjxhadYC2SQs0cy2D10SQYjP0zBWsU8M1XCP61kHm4/wvHOVbqwf1fERfzW0jzKvyS33AcBfu9OAJCd2hUMjL5oOzN+0xAi5TeRtDfChf7Kd4nKRnH5C0AAQ1ekymUFjpAehG0U6CQJQPPws8zpHl83+TJ2FGe7IxN+S4rbY/k/NLd8Zyi5Ndwo7NgjXHY/MhKXyZVY0yvwyYvTyB9K5nl+PPa5oIcjUSboSWsRaDpK925oMWxJBIK5nmA1tXf++E68+zdgY2Gz2Nfp0EhX1qr4/0duD6Wku2Sg6snSa/0aNovXoYJZ5HmAGpXMhk+nmEX5ObSnpyofdcXL9IQ4iWJfKQDVsnrjqWerp7FN4/Eu/WWKLDe9HKiDt9ylFPQ4H3pjNZX8qauROr50fehoYdIezrrq/LkhmLvd8Y94/jzKltOpL3STQ5wObJbRsRXkB2w8WcHNC8rtCdoJYQfOJXCPK0wJSdhvg32ecYvTk7UkRuG0WXSheLluvZRcjVNajS0PuVLox2aRbZ2NL8CcfAzs3CO7BJtyCtTa/SdL+dGLkXldMmljnI+t99xH6YG2wNgX3As9V8oeXh92Qrma+jYuBc+2uzEhiI4Z9H1zuTLmJuc4m+pW2aM75QDtbVQSWCexRYIrpfo4tXmFiXfOBa5LiIlT86PlS4gm/qAoHwhp2uNlV2qn+zjugdLCPseiy61FbTx66l49goLRE3x0YaKE6PcAQJJgxyiKZHonPVKYMDfVBS6S+Hyj7NCbrhddqsXyDBo4QhsJkXJdMmgJERg9n32bjksVn4g0bJKqPwm2S4H2G84f0Ob/CimPPMuV8CaC+Luw3itH4BDuaRjaGV8k1/eJGMAJk1ui9j4GeqH+LkGFllghXlte3qcRDroPwFm/Iz+DUpcZUx7I02+TWJ8Goq5BXkhqC3ySbw1CN+pNg40PJPKHhII2YlJzvYZ2uxd0oZ80WOFJUOtrEv/d8dmCzLJFIpffx9ZHWCez1dx3cEWgT9icMTpLNzYHqPQm2AF9KhqLYRg/707dj8kV+YlW8UasK9BszNcgdVvxfOV5Tor7AGhzK4cQ8l7ch6qi52H9i1UogAzDZudrQVAEPBt8a4vViDGBSznjk3dJWPGd8jhLU6izAWledUIhJ5QrqallGrfPGK7YoQ1P4rAc9gsUdAOHwj/nuvw+IqK+msJFl4TJblAXnSBQRkjQbW/ij3z5A9VgBzHatnJJXfh3ncFc11fNxDNUIG8b3mdC8R6BbgASGBd5EroY7DIPwyQrzG21d00aRbfXBjzc29wR8lyhB3jVqteFT5cN5BMh/wSH62MFkVly2rVscDMnOPvqXZpxP1jpszvQZV7gROYodnk9FgcFeSMQeuWvWCzUch6gG+slCGPiGKsVZAGTLjaLsr2126UFmIPjUVvgOlvpIyai7wDjfMasXV17GACQWsYa37MtQrFSZjzT1jnb1ag7SdsG8CjJvedKyMWyS51AWETxADNd0sDQZkc8KJhG/YFrQnUVDwyqhS6ESwyxbHeC6Yfvz9mEXR4LAC/O/VKWLVvr+panjTpwwEVPskEZIrE5YaRvsG781BitPJ9pYB6eQozzQnYxSahvhyzSLkK7jX9zEoAvraaMLhh1XVOjGyq27V4EmlNTHPzGXz/Y+MqG8FApwJsJ2m2UqD5qRg3z9lwB2skaP9tJ4eUymcC5ZNKum2tvbCqjvfysrJ+IExEA9Q5x3Rv9nh0A49WddGIVrRS2ILmnaaL5QRjjD2Ls5n3me1tprfHQVWBoPPE+387Mfdq3UCyKJdta4vYuIQJcqDdDL+ClucA7BWu0BKw0m/hSv9kqR4pIpCTm9u3HJpXpdUOkMUoeSKrEwg3rPt+uHXTnX2ZpCdnZsonKx+5FQEPQuoGgoltndWb9fqP59HqtgQlXPRNtgRu7WYS6lz2G25LPOSpidJHUPeNmFMnY41GMQY3egNg3oL8K7NQDgKQ0bkgfKkuQQOETT6tW2ZPDrF0Diu280yZAjLgOdoF2NhLrLl46IDr92DZD9FCf4zrNbhewx4ecz7BZqq5Q7Jgq93dvX4LkPyWlNiLTlsAAAAASUVORK5CYII='

const title = require('../../../package.json').name
@withRouter
export default class MainLayout extends Component {
  state = {
    collapsed: false,
    showTopMenu:false
  };

  componentDidMount() {
    const { location } = this.props
    this.checkPath(location.pathname)
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed })
  }
  topMenuFn = (v) => {
    this.checkPath(v.key)
  }

  checkPath = (path) => {
    if(path.includes('/monitor/dataSta')) {
      this.setState({ showTopMenu:true })
    } else {
      this.setState({ showTopMenu:false })
    }
  }

  render() {
    const { location, children } = this.props
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SideMenu
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          menuData={menuData}
          title={title}
          logo={titleLogo}
          location={location}
          topMenuFn={this.topMenuFn}
        />
        <Layout>
          {/* <Header style={{ background: '#fff', padding: 0 }}>
          {this.state.showTopMenu && <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px' }}
              >
              <Menu.Item key="1"><a href="#/deviceOm/hotelOp">dddd</a></Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>}
          </Header> */}
          <Content style={{ margin: '16px 16px 0 16px', background: '#fff', padding: 24, minHeight: 360 }}>
            {children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            智慧+服务平台 ©2018 Created by 未来酒店前端
          </Footer>
        </Layout>
      </Layout>
    )
  }
}
