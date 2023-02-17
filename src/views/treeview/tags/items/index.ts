import { FieldValueItem } from '../../../../util/treeview/field-value-item';
import { MessageTreeItem } from '../../../../util/treeview/message-tree-item';
import { TagItem } from './item';

export type TagTreeItem = MessageTreeItem | FieldValueItem | TagItem;
