<?php

namespace Database\Seeders;


use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin Brandly',
            'email' => 'admin@brandly.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'avatar' => null,
        ]);
    }
}