"use client";
import { IPagination } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const PaginationController = ({ pagination }: { pagination: IPagination }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (page === 1) params.delete("page");
      else params.set("page", page.toString());

      const queryString = params.toString();
      return queryString ? `${pathname}?${queryString}` : pathname;
    },
    [searchParams, pathname]
  );

  const getPageNumbers = () => {
    if (!pagination) return [];

    const { currentPage, totalPage } = pagination;
    const pages: (number | "ellipsis")[] = [];

    if (totalPage <= 7) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("ellipsis");

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPage - 2) pages.push("ellipsis");

      pages.push(totalPage);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return pagination && pagination.totalPage > 1 ? (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={pagination.previousPage ? createPageURL(pagination.previousPage) : "#"}
            aria-disabled={!pagination.previousPage}
            className={!pagination.previousPage ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink href={createPageURL(page)} isActive={page === pagination.currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={pagination.nextPage ? createPageURL(pagination.nextPage) : "#"}
            aria-disabled={!pagination.nextPage}
            className={!pagination.nextPage ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ) : null;
};

export default PaginationController;
