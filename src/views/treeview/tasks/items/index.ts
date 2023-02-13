import { FieldValueItem } from './../../../../util/treeview/field-value-item';
import { MessageTreeItem } from './../../../../util/treeview/message-tree-item';
import { TaskItem } from './item';

export type TaskTreeItem = MessageTreeItem | FieldValueItem | TaskItem;
