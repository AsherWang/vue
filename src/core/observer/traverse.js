/* @flow */

import { _Set as Set, isObject } from '../util/index'
import type { SimpleSet } from '../util/index'
import VNode from '../vdom/vnode'

// 存见过的对象的depId, 应该是防止递归遍历的时遇到循环引用
const seenObjects = new Set()

// 递归遍历一个对象, 用于调用所有修改后的getter(就是收集依赖了, 因为我们把收集依赖写道了getter中)
// todo: 问题, 怎么调用到getter了
// 以及, traverse过程中, seenObjects一直在变化,变化完事之后直接clear掉了?
/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse (val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear() // 清除掉, 对下次使用traverse不产生额外影响 
}

// 递归遍历
// 有点蠢一直没看到哪里调用getter
function _traverse (val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    // 这里调用了getter
    while (i--) _traverse(val[keys[i]], seen)
  }
}
