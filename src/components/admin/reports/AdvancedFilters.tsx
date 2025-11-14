import React, { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Filter, RotateCcw, Calendar, Tag, TrendingUp, Download } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import type { CategoryConfig } from '@/lib/reports-utils'

interface AdvancedFiltersProps {
  searchQuery: string
  selectedCategory: string
  dateRange: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onDateRangeChange: (value: string) => void
  onReset: () => void
  categories: CategoryConfig[]
  resultCount: number
  activeFiltersCount: number
}

export const AdvancedFilters = memo(({
  searchQuery,
  selectedCategory,
  dateRange,
  onSearchChange,
  onCategoryChange,
  onDateRangeChange,
  onReset,
  categories,
  resultCount,
  activeFiltersCount
}: AdvancedFiltersProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Campo de busca principal */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, descrição ou tags..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                aria-label="Buscar relatórios"
              />
            </div>
          </div>
          
          {/* Filtros avançados */}
          <div className="flex gap-3 flex-wrap">
            {/* Filtro de categoria */}
            <div className="flex-1 min-w-[160px]">
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SelectTrigger 
                        className="bg-gray-800 border-gray-700 text-white"
                        aria-label="Filtrar por categoria"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filtrar relatórios por categoria</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white">Todas as categorias</SelectItem>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category.id} value={category.id} className="text-white">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro de período */}
            <div className="flex-1 min-w-[140px]">
              <Select value={dateRange} onValueChange={onDateRangeChange}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SelectTrigger 
                        className="bg-gray-800 border-gray-700 text-white"
                        aria-label="Filtrar por período"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Período" />
                      </SelectTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filtrar relatórios por período de criação</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="week" className="text-white">Última semana</SelectItem>
                  <SelectItem value="month" className="text-white">Último mês</SelectItem>
                  <SelectItem value="quarter" className="text-white">Último trimestre</SelectItem>
                  <SelectItem value="year" className="text-white">Último ano</SelectItem>
                  <SelectItem value="all" className="text-white">Todos os períodos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Botão de reset */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={onReset}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    disabled={activeFiltersCount === 0}
                    aria-label="Limpar filtros"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Limpar todos os filtros</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Indicadores de filtros ativos e resultado da busca */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            {/* Filtros ativos */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Filtros ativos:</span>
                <div className="flex gap-2">
                  {searchQuery && (
                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                      <Search className="w-3 h-3 mr-1" />
                      Busca: "{searchQuery.slice(0, 10)}{searchQuery.length > 10 ? '...' : ''}"
                    </Badge>
                  )}
                  {selectedCategory !== 'all' && (
                    <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                      <Filter className="w-3 h-3 mr-1" />
                      {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                    </Badge>
                  )}
                  {dateRange !== 'all' && (
                    <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {dateRange === 'week' && 'Última semana'}
                      {dateRange === 'month' && 'Último mês'}
                      {dateRange === 'quarter' && 'Último trimestre'}
                      {dateRange === 'year' && 'Último ano'}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Resultado da busca */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Download className="w-4 h-4" aria-hidden="true" />
            <span aria-live="polite">
              {resultCount} relatório{resultCount !== 1 ? 's' : ''} encontrado{resultCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

AdvancedFilters.displayName = 'AdvancedFilters'