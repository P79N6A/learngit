import React from 'react'
import qs from 'querystring'
import Exception from '../components/exception'

export default function ExceptionPage({ match, location }) {
  return (
    <Exception type={match.params.code} {...qs.parse(location.search.slice(1))} />
  )
}
