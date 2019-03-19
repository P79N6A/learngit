import dynamic from 'dva/dynamic'

const modelNotExisted = (app, model) =>{
  // eslint-disable-next-line
  return !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1)
  })
}

// wrapper of dynamic
export default (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`./models/${model}`).default)
      }
    })
    return component().default
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>{
      return models.filter(model => modelNotExisted(app, model)).map(m => import(`./models/${m}.js`))
    },
    // add routerData prop
    component: () => component().then(raw => (raw.default || raw)),
  })
}
