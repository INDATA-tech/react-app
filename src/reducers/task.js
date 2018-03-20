import * as NetworkServices from '../services/networServices';
import * as Endpoints from '../const/endpoints';

import _ from 'lodash';

// Actions
const GET_TASKS = 'reducer/GET_TASKS';
const ADD_TASK = 'reducer/ADD_TASK';
const UPDATE_TASK = 'reducer/UPDATE_TASK';
const DELETE_TASK = 'reducer/DELETE_TASK';

// Reducer
export default (state = {
	state: [],
	tasks: [],
	inProgressGetTasks: false,
	inProgressUpdateTask: false,
	tasksUpdateNeeded: false,
	error: {
		status: false,
		message: ""
	}
}, action) => {
	switch (action.type) {
		case GET_TASKS:
			return {
				...state,
				tasks: action.tasks,
				tasksUpdateNeeded: action.tasksUpdateNeeded,
				inProgressGetTasks: action.inProgressGetTasks,
				error: action.error
			};
		case ADD_TASK:
			return {
				...state,
				tasksUpdateNeeded: action.tasksUpdateNeeded,
				inProgressAddTask: action.inProgressDeleteTask,
				error: action.error
			};
		case UPDATE_TASK:
			return {
				...state,
				tasksUpdateNeeded: action.tasksUpdateNeeded,
				inProgressUpdateTask: action.inProgressUpdateTask,
				error: action.error
			};
		case DELETE_TASK:
			return {
				...state,
				tasksUpdateNeeded: action.tasksUpdateNeeded,
				inProgressDeleteTask: action.inProgressDeleteTask,
				error: action.error
			};
		default:
			return state;
	}
}
export function getTasksByHouseId(houseID) {
	return function (dispatch) {
		let tasks = [];
		let endpoint = _.replace(Endpoints.getTasksByHouseId, '%houseID%', houseID);
		NetworkServices.requestData("GET", endpoint, "", true).then((response) => {
			if (response.data) {
				tasks = response.data;
				return dispatch({
					type: GET_TASKS,
					tasks: tasks,
					inProgressGetTasks: false
				});
			}
		}).catch(error => {
			return dispatch({
				type: GET_TASKS,
				tasks: [],
				inProgressGetTasks: false,
				error: {
					status: true,
					message: "" + error
				}
			});
		});
		return dispatch({
			type: GET_TASKS,
			tasks: [],
			tasksUpdateNeeded: false,
			inProgressGetTasks: true
		});
	}
};

export function addNewTask(data) {
	return function (dispatch) {
		NetworkServices.requestData("POST", Endpoints.addNewTask, data, true).then((response) => {
			return dispatch({
				type: ADD_TASK,
				tasksUpdateNeeded: true,
				inProgressAddTask: false
			});
		}).catch(error => {
			return dispatch({
				type: ADD_TASK,
				inProgressAddTask: false,
				error: {
					status: true,
					message: "" + error
				}
			});
		});
		return dispatch({
			type: ADD_TASK,
			inProgressAddTask: true
		});
	}
};

export function updateTask(data, taskID) {
	return function (dispatch) {
		let endpoint = _.replace(Endpoints.updateTask, '%taskID%', taskID);
		NetworkServices.requestData("PUT", endpoint, data, true).then((response) => {
			return dispatch({
				type: UPDATE_TASK,
				tasksUpdateNeeded: true,
				inProgressUpdateTask: false
			});
		}).catch(error => {
			return dispatch({
				type: UPDATE_TASK,
				inProgressUpdateTask: false,
				error: {
					status: true,
					message: "" + error
				}
			});
		});
		return dispatch({
			type: UPDATE_TASK,
			inProgressUpdateTask: true
		});
	}
};

export function deleteTaskById(taskID) {
	return function (dispatch) {
		let endpoint = _.replace(Endpoints.deleteTaskById, '%taskID%', taskID);
		NetworkServices.requestData("DELETE", endpoint, "", true).then((response) => {
			return dispatch({
				type: DELETE_TASK,
				tasksUpdateNeeded: true,
				inProgressDeleteTask: false
			});
		}).catch(error => {
			return dispatch({
				type: DELETE_TASK,
				inProgressDeleteTask: false,
				error: {
					status: true,
					message: "" + error
				}
			});
		});
		return dispatch({
			type: DELETE_TASK,
			inProgressDeleteTask: true
		});
	}
};
