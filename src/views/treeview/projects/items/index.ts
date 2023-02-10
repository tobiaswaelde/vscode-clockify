import { FieldValueItem } from '../../../../util/treeview/field-value-item';
import { MessageTreeItem } from './../../../../util/treeview/message-tree-item';
import { ProjectItem } from './item';

export type ProjectTreeItem = MessageTreeItem | FieldValueItem | ProjectItem;
