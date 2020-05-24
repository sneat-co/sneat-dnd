import { IMonitorBase } from './monitor-base';

/*
 * The monitor available inside {@link DragLayer#listen}.
 */
export interface IDragLayerMonitor<Item = any> extends IMonitorBase<Item> {
  /** `true` if there is a drag operation in progress, `false` otherwise. */
  isDragging(): boolean;
}

