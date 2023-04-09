import React, { ReactElement, useEffect, useState } from 'react';
import { reactive, effect } from '@vue/reactivity';
import { Todos } from '../model';

const todos = new Todos()
const model = reactive(todos);
// console.log(model, todos)

function observer(fc: React.FC) {
	return (props: any) => {
		const [comp, setComp] = useState<ReactElement<any, any> | null>(null);

		useEffect(() => {
			effect(() => {
				setComp(fc(props));
			})
		}, [])

		return comp
	}
}

const VueReactivity = observer(() => {
	return (
		<>
			<h1>Vue</h1>
			<div>
				<div>
					{
						model.data
							.filter(todo => !todo.completed)
							.map((todo) => (
								<div key={todo.id}>
									<div>{todo.text} <button onClick={() => model.complete(todo.id)}>完成</button></div>
								</div>
							))
					}
				</div>

				<div>
					<input value={model.inputStr} onChange={(e) => model.handleInput(e.target.value)} />
					<button onClick={model.add}>新增</button>
				</div>

				<div>
					{
						model.data
							.filter(todo => todo.completed)
							.map((todo) => (
								<div key={todo.id}>
									<del>{todo.text} <button>撤销</button></del>
								</div>
							))
					}
				</div>
			</div>
		</>
	)
})

export default VueReactivity;