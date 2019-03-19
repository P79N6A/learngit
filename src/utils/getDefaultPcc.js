const getDefaultPcc = (pcc) => {
    if(Object.prototype.toString.call(pcc) != '[object Array]') {
        return null
    }
    const l = pcc.length
    if(l == 1) {
        return [{
            value: pcc[0].code,
            label: pcc[0].descript,
          }]
    } else if(l == 2) {
        return [{
            value: pcc[0].code,
            label: pcc[0].descript,
            children: [{
              value: pcc[1].code,
              label: pcc[1].descript,
            }],
          }]
    } else if(l == 3) {
        return [{
            value: pcc[0].code,
            label: pcc[0].descript,
            children: [{
              value: pcc[1].code,
              label: pcc[1].descript,
              children: [{
                value: pcc[2].code,
                label: pcc[2].descript,
              }],
            }],
          }]
    }
}
const getInitPcc = (pcc) => {
    if(Object.prototype.toString.call(pcc) != '[object Array]') {
        return null
    }
    return pcc.map(v=>{
        return v.code
    })
}

export { getDefaultPcc, getInitPcc }