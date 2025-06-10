 
 

import React, { FC } from 'react';
import { Button } from './button';
import { Input } from './input';

const statusOptions = [
    { value: '', label: 'همه وضعیت‌ها' },
    { value: 'completed', label: 'تکمیل شده' },
    { value: 'pending', label: 'در انتظار' },
    { value: 'failed', label: 'ناموفق' },
    { value: 'refunded', label: 'بازگشت داده شده' },
];
const methodOptions = [
    { value: '', label: 'همه روش‌ها' },
    { value: 'credit_card', label: 'کارت اعتباری' },
    { value: 'bank_transfer', label: 'انتقال بانکی' },
    { value: 'digital_wallet', label: 'کیف پول دیجیتال' },
];

interface AdvancedFiltersProps {
    _filters: any;
    setFilters: (filters: any) => void;
}

export const AdvancedFilters: FC<AdvancedFiltersProps> = ({ _filters: filters, setFilters }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };
    const handleReset = () => {
        setFilters({
            status: '',
            method: '',
            dateFrom: '',
            dateTo: '',
            amountFrom: '',
            amountTo: '',
            search: '',
        });
    };
    return (
        <div className="flex flex-wrap gap-3 items-end mb-6 bg-card/60 p-4 rounded-xl shadow-sm border">
            <div>
                <label className="block text-xs mb-1">وضعیت</label>
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    className="input input-bordered rounded-md px-3 py-2 text-sm bg-background border focus:ring-2 focus:ring-primary"
                >
                    {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs mb-1">روش پرداخت</label>
                <select
                    name="method"
                    value={filters.method}
                    onChange={handleChange}
                    className="input input-bordered rounded-md px-3 py-2 text-sm bg-background border focus:ring-2 focus:ring-primary"
                >
                    {methodOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs mb-1">از تاریخ</label>
                <Input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleChange}
                    className="rounded-md px-3 py-2 text-sm bg-background border focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label className="block text-xs mb-1">تا تاریخ</label>
                <Input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleChange}
                    className="rounded-md px-3 py-2 text-sm bg-background border focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label className="block text-xs mb-1">حداقل مبلغ</label>
                <Input
                    type="number"
                    name="amountFrom"
                    value={filters.amountFrom}
                    onChange={handleChange}
                    className="rounded-md px-3 py-2 text-sm bg-background border focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label className="block text-xs mb-1">حداکثر مبلغ</label>
                <Input
                    type="number"
                    name="amountTo"
                    value={filters.amountTo}
                    onChange={handleChange}
                    className="rounded-md px-3 py-2 text-sm bg-background border focus:ring-2 focus:ring-primary"
                />
            </div>
            <div className="flex-1 min-w-[180px]">
                <label className="block text-xs mb-1">جستجو</label>
                <Input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="جستجو در پرداخت‌ها..."
                    className="rounded-md px-3 py-2 text-sm bg-background border focus:ring-2 focus:ring-primary"
                />
            </div>
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleReset} className="mt-4">ریست فیلترها</Button>
            </div>
        </div>
    );
}; 