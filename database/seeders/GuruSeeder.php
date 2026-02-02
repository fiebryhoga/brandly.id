<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GuruSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Budi Santoso, S.Kom',
            'email' => 'guru@brandly.id',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'guru',
            'nip' => '198501012010011001',
            'avatar' => null,
        ]);
        
        
    }
}
