
import { combineEpics } from 'redux-observable';
import indexEpic from './index-view';
import detailEpic from './detail-view';

export default combineEpics(indexEpic, detailEpic);
