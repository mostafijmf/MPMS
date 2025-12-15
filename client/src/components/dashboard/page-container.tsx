import { Fragment, ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { cn } from "@/lib/utils";

type PageContainerProps = {
  children?: ReactNode;
  title?: string;
  className?: string;
  headerClass?: string;
  breadcrumb?: { label: string; path: string } | { label: string; path: string }[];
  headerRightContent?: ReactNode;
};

const PageContainer = ({
  children,
  title,
  className,
  headerClass,
  breadcrumb,
  headerRightContent,
}: PageContainerProps) => {
  const defaultBread = { label: "Dashboard", path: "/dashboard" };
  const bread = breadcrumb ? (Array.isArray(breadcrumb) ? breadcrumb : [defaultBread, breadcrumb]) : [defaultBread];

  const breadLen = bread?.length;

  return (
    <div className={cn("p-5", className)}>
      <div className={cn("flex justify-between items-center", headerClass)}>
        <div>
          <h1 className="text-2xl font-semibold text-primary mb-1">{title}</h1>
          <Breadcrumb>
            <BreadcrumbList>
              {bread?.map((bread, i) => (
                <Fragment key={i}>
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {breadLen - 1 !== i ? (
                      <BreadcrumbLink asChild>
                        <Link href={bread?.path || "#"}>{bread?.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{bread?.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {headerRightContent}
      </div>
      {children}
    </div>
  );
};

export default PageContainer;
