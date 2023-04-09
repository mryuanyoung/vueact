const Proxy2Raw = new WeakMap();
const Raw2Proxy = new WeakMap();
const ReactionsMap = new WeakMap();
const ReactionStack = [];

function observable(target) {
	if (typeof target !== 'object') {
		return target;
	}

	const proxy = new Proxy(
		target,
		{
			get(target, key, receiver) {
				const result = target[key]
				// 对属性的读取操作作为依赖绑定到当前正在执行的Reaction的依赖中
				bindTargetKeyWithCurrentReaction({ target, key, receiver })

				if (Proxy2Raw.has(result)) {
					return result
				}

				return observable(result)
			},
			set(target, key, value, receiver) {
				const newValue = observable(value)
				const oldValue = target[key]
				target[key] = newValue

				// 执行reaction
				runReactionsFromTargetKey({ target, key })

				return true
			}
		}
	)

	Proxy2Raw.set(proxy, target);
	Raw2Proxy.set(target, proxy);

	return proxy;
}

function bindTargetKeyWithCurrentReaction(operation) {
	let { key, target } = operation

	const reactionLen = ReactionStack.length
	if (reactionLen === 0) return
	const current = ReactionStack[reactionLen - 1]
	if (!current) {
		return;
	}

	let reactionMap = ReactionsMap.get(target)
	if (reactionMap) {
		if (reactionMap.has(key)) {
			const reactions = reactionMap.get(key)
			if (!reactions.includes(current)) {
				reactions.push(current)
			}
		}
		else {
			reactionMap.set(key, [current]);
		}
	}
	else {
		reactionMap = new Map([[key, [current]]])
		ReactionsMap.set(target, reactionMap)
	}

	if (!current._reactions.includes(reactionMap)) {
		current._reactions.push(reactionMap)
	}
}

function runReactionsFromTargetKey(operation) {
	let { key, target } = operation

	const reactionMap = ReactionsMap.get(target);
	if (!reactionMap) {
		return;
	}

	const reactions = reactionMap.get(key);
	reactions.forEach(reaction => reaction());
}

function autorun(tracker) {
	const reaction = () => {
		ReactionStack.push(reaction)
		tracker()
		ReactionStack.pop()
	}

	reaction._reactions = []

	reaction();
}

const ob = observable({ a: 1 })

autorun(() => {
	console.log(ob, ob.a, ob.a.b);
})

ob.a = { b: 2 };
ob.a.b = 3;
