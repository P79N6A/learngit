import React,{ Component } from 'react';
/**
 * 只做一件事，把`WrappedComponent`回传个`getInstance`（如果有的话）
 */
export default (WrappedComponent) => {
    return class withRef extends Component {
      render() {
        const { getInstance } = this.props
        return (
          <WrappedComponent { ...this.props } ref={ getInstance } />
        );
      }
    };
  }