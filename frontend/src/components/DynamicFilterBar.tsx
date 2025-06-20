import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FilterItem = {
  value: string;
  label: string;
};

type FilterGroup = {
  id: string;
  label: string;
  items: FilterItem[];
};

type Props = {
  filterGroups: FilterGroup[];
};

export default function DynamicFilterBar({ filterGroups }: Props) {
  const [visibleCount, setVisibleCount] = useState<number>(filterGroups.length);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const allButtonRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navigate = useNavigate();

  const handleFilterClick = (filterType: string, filterValue: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(filterType, filterValue);
    navigate(`/?${params.toString()}`);
  };

  const updateVisibleCount = useCallback(() => {
    if (!containerRef.current || !allButtonRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const allButtonWidth = allButtonRef.current.offsetWidth;
    const availableWidth = containerWidth - allButtonWidth - 16;

    let currentWidth = 0;
    let newVisibleCount = 0;

    for (let i = 0; i < filterGroups.length; i++) {
      const itemWidth = itemRefs.current[i]?.offsetWidth;
      if (itemWidth && currentWidth + itemWidth <= availableWidth) {
        currentWidth += itemWidth;
        newVisibleCount++;
      } else {
        break;
      }
    }

    setVisibleCount(newVisibleCount);
  }, [filterGroups]);

  useEffect(() => {
    const observer = new ResizeObserver(updateVisibleCount);
    const container = containerRef.current;
    if (container) observer.observe(container);
    updateVisibleCount();

    return () => {
      if (container) observer.unobserve(container);
    };
  }, [updateVisibleCount]);

  const visibleGroups = filterGroups.slice(0, visibleCount);

  const renderGroupAsDropdown = (group: FilterGroup) => (
    <DropdownMenu key={group.id}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 shrink-0 cursor-pointer"
        >
          {group.label}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {group.items.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => handleFilterClick(group.id, item.value)}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center w-full h-full overflow-hidden"
    >
      <div
        className="absolute top-[-9999px] left-[-9999px] flex"
        aria-hidden="true"
      >
        {filterGroups.map((group, index) => (
          <Button
            key={group.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            variant="ghost"
          >
            {group.label}
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        ))}
      </div>

      {/* "Todos" button for overflow */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={allButtonRef}
            variant="ghost"
            className="font-semibold text-gray-800 hover:bg-gray-100 hover:text-gray-900 shrink-0 cursor-pointer"
          >
            Todos
            {filterGroups.length > 0 && (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </Button>
        </DropdownMenuTrigger>
        {filterGroups.length > 0 && (
          <DropdownMenuContent align="start">
            {filterGroups.map((group, index) => (
              <DropdownMenuGroup key={group.id}>
                <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                {group.items.map((item) => (
                  <DropdownMenuItem
                    key={item.value}
                    onClick={() => handleFilterClick(group.id, item.value)}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
                {index < filterGroups.length - 1 && <DropdownMenuSeparator />}
              </DropdownMenuGroup>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      {/* Visible filters */}
      {visibleGroups.map((group) => renderGroupAsDropdown(group))}
    </div>
  );
}
