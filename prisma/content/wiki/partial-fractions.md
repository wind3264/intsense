# Partial Fractions

Partial fractions splits a rational function into a sum of simpler fractions, each of which integrates to a logarithm or an arctangent.

## The method

1. If the degree of the numerator is at least the degree of the denominator, do polynomial long division first.
2. Factor the denominator into linear and irreducible quadratic factors.
3. Write one term per factor: $\frac{A}{x - r}$ for a linear factor, $\frac{Bx + C}{x^2 + bx + c}$ for a quadratic, and one term per power for repeated factors.
4. Solve for the constants and integrate term by term.

## Example

$$
\int_0^1 \frac{dx}{(x + 1)(x + 2)}
$$

Write $\frac{1}{(x + 1)(x + 2)} = \frac{A}{x + 1} + \frac{B}{x + 2}$.
Covering up $(x + 1)$ and setting $x = -1$ gives $A = 1$; covering up $(x + 2)$ and setting $x = -2$ gives $B = -1$.
So

$$
\int_0^1 \left( \frac{1}{x + 1} - \frac{1}{x + 2} \right) dx = \Big[\ln\frac{x + 1}{x + 2}\Big]_0^1 = \ln\frac{2}{3} - \ln\frac{1}{2} = \ln\frac{4}{3}.
$$

## Speed tips

- The cover-up method above finds the constant of every distinct linear factor instantly - no system of equations needed.
- Useful ready-made decompositions: $\frac{1}{x^2 - 1} = \frac{1}{2}\left(\frac{1}{x - 1} - \frac{1}{x + 1}\right)$ and $\frac{1}{(x^2 + a^2)(x^2 + b^2)} = \frac{1}{b^2 - a^2}\left(\frac{1}{x^2 + a^2} - \frac{1}{x^2 + b^2}\right)$.
