import { observable } from '@formily/reactive';
import { observer } from '@formily/reactive-react'
import { Todos } from '../model';

const todos = new Todos()
const model = todos;
window.fmodel = model;
window.ftodos = todos;

const FormilyReactive = observer(() => {
	return (
		<>
			<h1>FormilyReactive</h1>
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

export default FormilyReactive;