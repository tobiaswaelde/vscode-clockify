import { MessageTreeItem } from '../../util/message-tree-item';
import { WorkspaceInfoItem } from './info-item';
import { WorkspaceItem } from './item';

export type WorkspaceTreeItem = MessageTreeItem | WorkspaceItem | WorkspaceInfoItem;
