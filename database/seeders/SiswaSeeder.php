<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Siswa Pemasaran Digital',
            'email' => 'siswa@brandly.id',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'siswa',
            'nis' => '20261001',
            'avatar' => null,
        ]);
    }
}
