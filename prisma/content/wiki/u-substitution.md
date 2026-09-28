# u-Substitution

u-substitution is the chain rule run backwards.
If the integrand contains some inner function $g(x)$ together with its derivative $g'(x)$, set $u = g(x)$ and the integral collapses:

$$
\int f(g(x))\, g'(x) \, dx = \int f(u) \, du.
$$

## When to reach for it

Look for a function and its derivative sitting side by side.
Common pairs are $x^2$ and $x$, $\ln x$ and $\frac{1}{x}$, $\sin x$ and $\cos x$, and $e^x$ with itself.
If the derivative is only off by a constant factor, that is fine - pull the constant out.

## Example

$$
\int x e^{x^2} \, dx
$$

Let $u = x^2$, so $du = 2x \, dx$ and $x \, dx = \frac{1}{2} du$.
Then

$$
\int x e^{x^2} \, dx = \frac{1}{2} \int e^u \, du = \frac{1}{2} e^{x^2} + C.
$$

## Definite integrals

When the integral has bounds, change the bounds along with the variable instead of substituting back at the end.
For $\int_0^1 \frac{x}{\sqrt{1+x^2}} \, dx$ with $u = 1 + x^2$, the bounds become $u = 1$ to $u = 2$:

$$
\frac{1}{2} \int_1^2 u^{-1/2} \, du = \Big[\sqrt{u}\Big]_1^2 = \sqrt{2} - 1.
$$

## Speed tips

- Substitutions like $u = \sqrt{x}$ or $u = x^{1/6}$ clear roots; pick the power that removes all of them at once.
- $\int \frac{f'(x)}{f(x)} \, dx = \ln|f(x)| + C$ comes up constantly - recognize it on sight.
