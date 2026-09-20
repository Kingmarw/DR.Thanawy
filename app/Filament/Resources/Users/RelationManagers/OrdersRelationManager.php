<?php

namespace App\Filament\Resources\Users\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class OrdersRelationManager extends RelationManager
{
    protected static string $relationship = 'orders';

    protected static ?string $title = 'المشتريات';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('product_name')

            ->columns([
                TextColumn::make('product_name')
                    ->label('الصف')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('price')
                    ->label('السعر')
                    ->money('EGP')
                    ->sortable(),

                TextColumn::make('payment_status')
                    ->label('حالة الدفع')
                    ->badge()
                    ->sortable(),

                TextColumn::make('payment_method')
                    ->label('طريقة الدفع')
                    ->placeholder('غير محدد'),

                TextColumn::make('payment_transaction_id')
                    ->label('رقم العملية')
                    ->placeholder('غير موجود'),

                TextColumn::make('created_at')
                    ->label('تاريخ الشراء')
                    ->dateTime('d/m/Y h:i A')
                    ->sortable(),
            ])

            ->filters([])

            ->headerActions([])

            ->recordActions([])

            ->toolbarActions([]);
    }
}