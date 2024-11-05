import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ImagesService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.AP_BK_URL,
      process.env.AP_BK_APIKEY,
    );
  }

  async upload(
    file: Express.Multer.File,
    folderName: string,
    fileName: string,
  ) {
    const { error } = await this.supabase.storage
      .from('airScapeBKT')
      .upload(`${folderName}/${fileName}`, file.buffer, {
        contentType: file.mimetype,
      });
    if (error) {
      alert(error.message);
      return;
    }
    const { data } = await this.supabase.storage
      .from('airScapeBKT')
      .getPublicUrl(`${folderName}/${fileName}`);
    return data.publicUrl;
  }

  async updateProfilePhoto(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const folder = 'profile';
    const { data: existingImage, error: checkError } =
      await this.supabase.storage
        .from('airScapeBKT')
        .list(folder, { search: userId });

    if (checkError) {
      console.error('Error checking for existing image:', checkError.message);
    }

    if (existingImage && existingImage.length > 0) {
      const { error: deleteError } = await this.supabase.storage
        .from('airScapeBKT')
        .remove([`${folder}/${existingImage[0].name}`]);

      if (deleteError) {
        console.error(
          'Error checking for existing image:',
          deleteError.message,
        );
      }
    }
    const { error } = await this.supabase.storage
      .from('airScapeBKT')
      .upload(`${folder}/${userId}`, file.buffer, {
        contentType: file.mimetype,
      });
    if (error) {
      alert(error.message);
    }
    const { data } = await this.supabase.storage
      .from('airScapeBKT')
      .getPublicUrl(`${folder}/${userId}`);

    return `${data.publicUrl}?t=${new Date().getTime()}`;
  }
}
