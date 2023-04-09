import {model, define, observable, action} from '@formily/reactive';

interface Todo { id: number, text: string, completed: boolean }

export class Todos {

	a = {b: {c: {d: 1}}}

	constructor(
		public data: Todo[] = [],
		public inputStr: string = ''
	) {
		// debugger;
		define(this, {a: observable, data: observable, inputStr: observable, add: action.bound});
	}

	handleInput(value: string) {
		debugger;
		this.inputStr = value;
	}

	add() {
		if (!this.inputStr) {
			return;
		}

		debugger;
		this.data.push({
			id: Math.random() + 1,
			text: this.inputStr,
			completed: false
		});

		this.inputStr = '';
	}

	findItem(id: number) {
		const item = this.data.find(item => item.id === id);
		if (!item) {
			return {
				item,
				idx: -1
			}
		}

		const idx = this.data.indexOf(item);
		return {
			item, idx
		}
	}

	delete(id: number) {
		const { idx } = this.findItem(id);
		if(idx === -1){
			return;
		}

		this.data.splice(idx, 1);
	}

	complete(id: number) {
		const { item } = this.findItem(id);
		if (!item) {
			return;
		}

		item.completed = true;
	}
}