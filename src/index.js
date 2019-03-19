import scu from '@alife/scu'
// import './index.less'

// 1. Initialize
const app = scu()

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('@models/initMenu/initMenu').default)

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')
