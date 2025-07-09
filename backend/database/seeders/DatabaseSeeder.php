<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

   User::create([
    'name' => 'Admin',
    'email' => 'admin@gmail.com',
    'password' => bcrypt('admin@123'),
    'role' => 'admin',
]);

   User::create([
    'name' => 'user',
    'email' => 'user@gmail.com',
    'password' => bcrypt('user@123'),
    'role' => 'user',
]);
    }
}
