import { FieldValueItem } from '../../../../util/treeview/field-value-item';
import { MessageTreeItem } from '../../../../util/treeview/message-tree-item';
import { WorkspaceItem } from './item';

export type WorkspaceTreeItem = MessageTreeItem | FieldValueItem | WorkspaceItem;
