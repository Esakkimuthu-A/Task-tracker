import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AddTask } from '../../core/models/to-do-list.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // esakkimuthua2002@gmail.com 
  // Esakki@2002

  // mesakki834@gmail.com
  // project_name : Task Tracker
  // password : task_tracker@02

  private supabase!: SupabaseClient;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router:Router) {
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(environment.supabase.url, environment.supabase.key);
    }
  }

  async signUp(email: string, password: string, options: string): Promise<any> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: options }
        }
      });
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<any> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<any> {
    if (!this.supabase) {
      console.error('Supabase client not initialized');
      return null;
    }

    try {
      const { data, error } = await this.supabase.auth.getUser();
      if (error) {
        throw error;
      }
      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  async addSupaData( task: string, description: string, startDate: string, endDate: string, selectedLabels: any[], status: string) {
    const userId = await this.getUserId();
    const dataWithId = {
      task,
      description,
      startDate,
      endDate,
      selectedLabels,
      status,
      user_id: userId
    };
    const { data: result, error } = await this.supabase
      .from('task')
      .insert([dataWithId])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
    }
    
    return { data: result, error };
  }

  async updateTask(taskId: string, updatedData: Partial<AddTask>) {
    const { data, error } = await this.supabase
      .from('task')
      .update(updatedData)
      .eq('id', taskId)
      .select();
  
    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }
    return data;
  }

  async getUserId() {
    const res = await this.getCurrentUser();
    if (!res) {
      console.error('User not found or Supabase not initialized');
      return null;
    }
    return res.id;
  }
  

  async getUserTasks() {
    const userId = await this.getUserId();

    if (!userId) {
      console.error('Cannot fetch tasks: user ID is null');
      return { data: null, error: 'User ID is null' };
    }
  
    const { data: tasks, error } = await this.supabase
      .from('task')
      .select('*')
      .eq('user_id', userId); // Filter by user ID
  
    if (error) {
      console.error('Supabase fetch error:', error);
    }
  
    return { data: tasks, error };
  }

  async completeTask(task: any): Promise<boolean | null> {
    const updatedTask = {
      ...task,
      updatedAt: new Date().toISOString()
    };
  
    if (!this.supabase) {
      console.error('Supabase updateAt not initialized');
      return null;
    }
  
    try {
      const { data, error, status } = await this.supabase
      .from('task')
      .update(updatedTask)
      .eq('id', task.id)
      .select();
  
      if (error) {
        console.error('Supabase update error:', error);
        return null;
      }
      return true;
    } catch (error) {
      console.error('Unexpected error updating task:', error);
      return null;
    }
  }

 async checkIfEmailExists(email: string): Promise<boolean> {
  if (!this.supabase) {
    console.error('Supabase not initialized');
    return false;
  }
  const { data, error } = await this.supabase
    .from('user')
    .select('id')
    .eq('email', email)
    .limit(1);
  if (error) {
    console.error('Error checking email:', error);
    return false;
  }
   return data.length > 0;
 }

async signOut(): Promise<void> {
  if (!this.supabase) {
    throw new Error('Supabase not initialized');
  }
  try {
    const { error } = await this.supabase.auth.signOut();
    localStorage.removeItem("$ecret");
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}


async signUpWithGoogle(): Promise<boolean> {
  if (!this.supabase) {
    console.error('Supabase not initialized');
    return false;
  }

  const { data, error } = await this.supabase.auth.signInWithOAuth({
    provider: 'google'
  });

  if (error) {
    console.error('OAuth sign-in error:', error.message);
    return false;
  }

  if (data?.url) {
    window.location.href = data.url;
    return true;
  }

  return false;
}

  async isAuthenticated(): Promise<boolean> {
    if (!this.supabase) {
      console.error('Supabase not initialized');
      return false;
    }
    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) {
        throw error;
      }
      return !!data.session;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

}
