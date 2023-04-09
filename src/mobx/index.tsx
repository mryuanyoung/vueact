import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite'
import { Todos } from '../model';

const todos = new Todos()
const model = makeAutoObservable(todos);
window.mmodel = model;
window.mtodos = todos;

const MobX = observer(() => {
	// console.log('[render]')
	return (
		<>
			<h1>MobX</h1>
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
									<del>{todo.text} <button onClick={() => model.delete(todo.id)}>删除</button></del>
								</div>
							))
					}
				</div>
			</div>
		</>

	)
})

export default MobX;