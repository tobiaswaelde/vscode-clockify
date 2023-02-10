import { FieldValueItem } from '../../../../util/treeview/field-value-item';
import { MessageTreeItem } from '../../../../util/treeview/message-tree-item';
import { ClientItem } from './item';

export type ClientTreeItem = MessageTreeItem | FieldValueItem | ClientItem;
