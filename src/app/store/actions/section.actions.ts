import { Section } from '../../models/section.model';

export class FetchContent {
  static readonly type = '[Content] Fetch';
  constructor(public section: string) {}
}

export class SaveContent {
  static readonly type = '[Content] Save';
  constructor(public content: Partial<Section>) {}
}

export class UpdateContent {
  static readonly type = '[Content] Update';
  constructor(public content: Partial<Section>) {}
}

export class UploadImage {
  static readonly type = '[Content] Upload Image';
  constructor(public file: File) {}
}

export class DeleteContent {
  static readonly type = '[Content] Delete';
  constructor(public id: number) {}
}

export class InitializeApp {
  static readonly type = '[App] Initialize';
}
